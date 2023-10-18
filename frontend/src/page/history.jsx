import React from "react";
import { format } from 'date-fns';
import Navbar from '../component/navbar';
import axios from "axios"
import $ from "jquery";


export default class User extends React.Component {
    constructor() {
        super();
        this.state = {
            pemesanan: [],
            typeroom: [],
            id: "",
            nomor_pemesanan: "",
            nama_pemesanan: "",
            email_pemesanan: "",
            tgl_pemesanan: "",
            tgl_check_in: "",
            tgl_check_out: "",
            nama_tamu: "",
            jumlah_kamar: "",
            id_tipe_kamar: "",
            status_pemesanan: "",
            role: "",
            token: "",
            action: "",
            keyword: ""
        };

        if (localStorage.getItem("token")) {
            if (localStorage.getItem("role") === "resepsionis") {
                this.state.token = localStorage.getItem("token");
                this.state.role = localStorage.getItem("role");
            } else if (localStorage.getItem("role") === "admin") {
                window.location = "/kamar";
            } else if (localStorage.getItem("role") === "customer") {
                window.location = "/beranda";
            }
        }
    }

    headerConfig = () => {
        let header = {
            headers: { Authorization: `Bearer ${this.state.token}` }
        }
        return header
    }

    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value,
        });
    };

    handleClose = () => {
        $("#modal_pemesanan").hide()
    };

    handleFile = (e) => {
        this.setState({
            foto: e.target.files[0]
        })
    }

    _handleFilter = () => {
        let data = {
            keyword: this.state.keyword,
        }
        let url = "http://localhost:8000/user/find"
        axios.post(url, data)
            .then(response => {
                if (response.status === 200) {
                    this.setState({
                        user: response.data.data
                    })
                } else {
                    alert(response.data.message)
                    this.setState({ message: response.data.message })

                }
            })
            .catch(error => {
                console.log("error", error.response.status)
            })
    }

    handleEditStatus = (item) => {
        $("#modal_pemesanan").show()
        this.setState({
            id: item.id,
            status_pemesanan: item.status_pemesanan,
            action: "update"
        })
    }

    handleSave = (e) => {
        e.preventDefault()

        let form = {
            id: this.state.id,
            status_pemesanan: this.state.status_pemesanan
        }
        if (this.state.action === "update") {
            let url = "http://localhost:8000/pemesanan/" + this.state.id
            axios.put(url, form, this.headerConfig())
                .then(response => {
                    this.getPemesanan()
                    this.handleClose()
                })
                .catch(error => {
                    console.log(error)
                })

        }

    }

    getPemesanan = () => {
        let url = "http://localhost:8000/pemesanan/";
        axios
            .get(url, this.headerConfig())
            .then((response) => {
                this.setState({
                    pemesanan: response.data.data,
                });
                console.log(response.data.data)
            })
            .catch((error) => {
                console.log(error);
            });
    };

    getTypeRoom = () => {
        let url = "http://localhost:8000/tkamar"
        axios.get(url, this.headerConfig())
            .then(response => {
                this.setState({
                    typeroom: response.data.data
                })
                console.log(response.data.data)
            })
            .catch((error) => {
                console.log(error)
            })
    }

    checkRole = () => {
        if (this.state.role === "admin") {
            window.location = '/kamar'
        } else if (this.state.role === "customer") {
            window.location = '/beranda'
        }
    }

    componentDidMount() {
        this.getPemesanan();
        this.getTypeRoom();
        this.checkRole()
    }

    render() {
        return (
            <>
                <Navbar />

                <div class="my-6">
                    <div className="mt-28 flex justify-center">
                        <h3 className="text-2xl">History</h3>
                    </div>

                    <div className="flex justify-center mr-4">
                        <div className="flex rounded w-3/4 mt-7 mb-5">
                                <input
                                    type="text"
                                    className=" block w-full px-4 py-2 bg-white border rounded-md focus:border-blue-400 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
                                    placeholder="Search..."
                                    name="keyword"
                                    value={this.state.keyword}
                                    onChange={this.handleChange}
                                />

                                <button className="w-1/6 ml-2 px-4 text-white bg-blue-600 border border-1 border-blue-600 rounded hover:bg-blue-700" onClick={this._handleFilter}>
                                    {/* <FontAwesomeIcon icon={faSearch} color="blue" /> */}Cari
                                </button>                      
                        </div>
                    </div>

                    <table className="w-3/4 mx-auto shadow-2xl">
                        <thead>
                            <tr>
                                <th className="px-1 py-3 text-center text-xs font-medium uppercase tracking-wider">No Pemesanan</th>
                                <th className="px-1 py-3 text-center text-xs font-medium uppercase tracking-wider">Nama Pemesan</th>
                                <th className="px-1 py-3 text-center text-xs font-medium uppercase tracking-wider">Email Pemesan</th>
                                <th className="px-1 py-3 text-center text-xs font-medium uppercase tracking-wider">Tanggal Akses</th>
                                <th className="px-1 py-3 text-center text-xs font-medium uppercase tracking-wider">Nama Tamu</th>
                                <th className="px-1 py-3 text-center text-xs font-medium uppercase tracking-wider">Jumlah Kamar</th>
                                <th className="px-1 py-3 text-center text-xs font-medium uppercase tracking-wider">Tipe Kamar</th>
                                <th className="px-1 py-3 text-center text-xs font-medium uppercase tracking-wider">Total Harga</th>
                                <th className="px-1 py-3 text-center text-xs font-medium uppercase tracking-wider">Status</th>
                                <th className="px-1 py-3 text-center text-xs font-medium uppercase tracking-wider">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.pemesanan.map((item, index) => {
                                return (
                                    <tr key={index}>
                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                            <div className="text-sm text-gray-900">{item.nomor_pemesanan}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                            <div className="text-sm text-gray-900">{item.nama_pemesanan}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                            <div className="text-sm text-gray-900">{item.email_pemesanan}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                            <div className="text-sm text-gray-900">
                                                {format(new Date(item.tgl_check_in), 'dd MMM yyyy')} s/d {format(new Date(item.tgl_check_out), 'dd MMM yyyy')}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                            <div className="text-sm text-gray-900">{item.nama_tamu}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                            <div className="text-sm text-gray-900">{item.jumlah_kamar}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-indigo-100 text-indigo-800">
                                                {item.nama_tipe_kamar}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                            <div className="text-sm text-gray-900">{item.harga}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                            <div className="text-sm text-gray-900">{item.status_pemesanan}</div>

                                        </td>


                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                            <button class="bg-green-600 hover:bg-green-700 text-white py-1 px-2 rounded mr-2" onClick={() => this.handleEditStatus(item)}>
                                                Edit
                                            </button>
                                        </td>

                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Modal Form */}
                <div id="modal_pemesanan" tabindex="-1" aria-hidden="true" class="overflow-x-auto fixed top-0 left-0 right-0 z-50 hidden w-full p-4 md:inset-0 h-modal md:h-full bg-tranparent bg-black bg-opacity-50">
                    <div class="flex lg:h-auto w-auto justify-center ">
                        <div class="relative bg-white rounded-lg shadow dark:bg-white w-1/3">
                            <button type="button" class="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white" onClick={() => this.handleClose()}>
                                <svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
                                <span class="sr-only">Tutup modal</span>
                            </button>
                            <div class="px-6 py-6 lg:px-8">
                                <h3 class="mb-4 text-xl font-medium text-gray-900 dark:text-black">Pemesanan</h3>
                                <form class="space-y-6" onSubmit={(event) => this.handleSave(event)}>
                                    <div>
                                        <label for="role" class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-800">Status</label>
                                        <select className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-gray-800 block w-full p-2.5 dark:bg-white dark:border-gray-500 dark:placeholder-gray-400 dark:text-black" placeholder="Pilihan status" name="status_pemesanan" value={this.state.status_pemesanan} onChange={this.handleChange} required>
                                            <option value="">Pilih Status</option>
                                            <option value="baru">Baru</option>
                                            <option value="check_in">Check In</option>
                                            <option value="check_out">Check Out</option>
                                        </select>
                                    </div>
                                    <button type="submit" class="w-full text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2">Simpan</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>

            </>
        );
    }
}