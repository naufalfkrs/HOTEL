import React from "react";
import { format } from 'date-fns';
import Navbar from '../component/navbar_customer';
import axios from "axios"
import $ from "jquery";

export default class Beranda extends React.Component {
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
            id_user: "",
            role: "",
            token: "",
            action: "",
            keyword: ""
        };
        this.state.id_user = localStorage.getItem("id")

        if (localStorage.getItem("token")) {
            if (localStorage.getItem("role") === "customer") {
                this.state.token = localStorage.getItem("token");
                this.state.role = localStorage.getItem("role");
            } else if (localStorage.getItem("role") === "admin") {
                window.location = "/kamar";
            } else if (localStorage.getItem("role") === "resepsionis") {
                window.location = "/history";
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

    getPemesanan = () => {
        let url = "http://localhost:8000/pemesanan/" + this.state.id_user;
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
        } else if (this.state.role === "resepsionis") {
            window.location = '/history'
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
                                <th className="px-1 py-3 text-center text-xs font-medium uppercase tracking-wider">Print</th>
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
                                            <button class="bg-green-600 hover:bg-green-700 text-white py-1 px-2 rounded mr-2" onClick={() => this.handlePrint(item)}>
                                                Print
                                            </button>
                                        </td>

                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </>
        )
    }
}