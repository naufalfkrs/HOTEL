import React from "react";
import Navbar from '../component/navbar_customer';
import axios from "axios"
import $ from "jquery";

export default class Beranda extends React.Component {
    constructor() {
        super()
        this.state = {
            user: [],
            pemesanan: [],
            id: "",
            nama_pemesanan: "",
            email_pemesanan: "",
            tgl_check_in: "",
            tgl_check_out: "",
            nama_tamu: "",
            jumlah_kamar: "",
            id_tipe_kamar: "",
            id_user: "",

            tipe_kamars: [],
            nama_tipe_kamar: "",
            harga: "",
            deskripsi: "",
            foto: "",
            role: "",
            token: "",
            action: "",
            keyword: ""
        }

        this.state.id_user = localStorage.getItem("id")
        this.state.nama_pemesanan = localStorage.getItem("username")
        this.state.email_pemesanan = localStorage.getItem("email")

        if (localStorage.getItem("token")) {
            if (localStorage.getItem("role") === "customer") {
                this.state.token = localStorage.getItem("token")
                this.state.role = localStorage.getItem("role")
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
        return header;
    }

    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    handleFile = (e) => {
        this.setState({
            foto: e.target.files[0]
        })
    }

    handleClose = () => {
        $("#modal_pemesanan").hide()
    }

    handleAdd = (item) => {
        $("#modal_pemesanan").show()
        this.setState({
            id: "",
            nama_pemesanan: this.state.nama_pemesanan,
            email_pemesanan: this.state.email_pemesanan,
            tgl_check_in: "",
            tgl_check_out: "",
            nama_tamu: "",
            jumlah_kamar: "",
            nama_tipe_kamar: item.nama_tipe_kamar,
            id_user: this.state.id_user,
            action: "insert"
        })
        console.log(item)
    }

    handleSave = (e) => {
        e.preventDefault()
        let form = {
            id: this.state.id,
            nama_pemesanan: this.state.nama_pemesanan,
            email_pemesanan: this.state.email_pemesanan,
            tgl_check_in: this.state.tgl_check_in,
            tgl_check_out: this.state.tgl_check_out,
            nama_tamu: this.state.nama_tamu,
            jumlah_kamar: this.state.jumlah_kamar,
            nama_tipe_kamar: this.state.nama_tipe_kamar,
            id_user: this.state.id_user,
        }

        if (this.state.action === "insert") {
            let url = "http://localhost:8000/pemesanan"
            axios.post(url, form, this.headerConfig())

                .then(response => {
                    console.log("data masuk", response.status)
                    this.getPemesanan()
                    this.handleClose()
                    window.location = "/riwayat";
                })

                .catch(error => {
                    console.log("error add data", error.response.status)
                    if (error.response.status === 500) {
                        window.alert("Failed to add data");
                    }
                })
        }
    }

    _handleFilter = () => {
        let data = {
            keyword: this.state.keyword,
        }
        let url = "http://localhost:8000/tkamar/find"
        axios.post(url, data)
            .then(response => {
                if (response.status === 200) {
                    this.setState({
                        tipe_kamars: response.data.data
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

    getTypeRoom = () => {
        let url = "http://localhost:8000/tkamar"
        axios.get(url, this.headerConfig())
            .then(response => {
                this.setState({
                    tipe_kamars: response.data.data
                })
                console.log(response.data.data)

            })
            .catch((error) => {
                console.log(error)
            })
    }

    getPemesanan = () => {
        let url = "http://localhost:8000/pemesanan"
        axios.get(url, this.headerConfig())
            .then(response => {
                this.setState({
                    pemesanan: response.data.data
                })
                console.log(response.data.data)

            })
            .catch((error) => {
                console.log(error)
            })
    }

    mindDate = (e) => {
        // const tgl_check_in = e.target.value;
        // const tgl_check_out = e.target.value;
        // const currentDate = new Date();

        // const tomorrow = new Date(currentDate);
        // tomorrow.setDate(currentDate.getDate() + 1);

        // const inputDate = new Date(tgl_check_in);
        // // Memeriksa apakah tanggal yang dimasukkan adalah hari kemarin atau lebih awal
        // if (inputDate <= currentDate) {
        //     alert('Tidak bisa memilih hari kemarin atau lebih awal.');
        // } else {
        //     this.setState({ tgl_check_in });
        // }

    }

    checkRole = () => {
        if (this.state.role === "admin") {
            window.location = '/kamar'
        } else if (this.state.role === "resepsionis") {
            window.location = '/history'
        }
    }

    componentDidMount() {
        this.getTypeRoom()
        this.getPemesanan()
        this.checkRole()
    }

    render() {
        return (
            <>
                <Navbar />
                <div class="my-6">

                    <div class="flex items-center justify-center h-screen">

                        <div class="w-[50vw] h-[45vh] bg-blue-500 rounded-md flex items-center justify-center">
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
                    </div>

                    <div className="flex flex-wrap w-5/6 mx-auto border-solid border-2 border-red-400">
                        {this.state.tipe_kamars.map((item, index) => {
                            return (

                                <div key={index} className="w-[20vw] h-[45vh] border-solid border-2 border-sky-500">
                                    <div className=" rounded shadow-md bg-stone-400">
                                        <img src={"http://localhost:8000/gambar/" + item.foto} className="w-52 h-52 mx-auto" alt={item.nama_tipe_kamar} />
                                        <div className="px-6 py-4">
                                            <div className="font-bold text-xl mb-2">{item.nama_tipe_kamar}</div>
                                        </div>
                                        <div className="px-6 py-4">
                                            <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2">
                                                {item.harga}
                                            </span>
                                            <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2">
                                                {item.deskripsi}
                                            </span>
                                        </div>
                                        <div className="px-6 py-4">
                                            <button className="w-1/6 ml-2 px-3 py-2 text-white bg-blue-600 rounded hover:bg-blue-700" onClick={() => this.handleAdd(item)}>
                                                Add +
                                            </button>
                                        </div>
                                    </div>
                                </div>

                            );
                        })}

                    </div>

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
                                            <label for="nama_pemesanan" class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-800">Nama Pemesan</label>
                                            <input type="text" name="nama_pemesanan" id="nama_pemesanan" value={this.state.nama_pemesanan} onChange={this.handleChange} class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-gray-800 block w-full p-2.5 dark:bg-white dark:border-gray-500 dark:placeholder-gray-400 dark:text-gray-800" placeholder="Masukkan username user" required />
                                        </div>
                                        <div>
                                            <label for="email_pemesanan" class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-800">Email</label>
                                            <input type="email" name="email_pemesanan" id="email_pemesanan" value={this.state.email_pemesanan} onChange={this.handleChange} class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-gray-800 block w-full p-2.5 dark:bg-white dark:border-gray-500 dark:placeholder-gray-400 dark:text-gray-800" placeholder="Masukkan email user" required />
                                        </div>
                                        <div>
                                            <label for="tgl_check_in" class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-800">Tanggal Check In</label>
                                            <input type="date" name="tgl_check_in" id="tgl_check_in" min={new Date().toISOString().split('T')[0]} value={this.state.tgl_check_in} onChange={this.handleChange} class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-gray-800 block w-full p-2.5 dark:bg-white dark:border-gray-500 dark:placeholder-gray-400 dark:text-gray-800" placeholder="Masukkan password" required disabled={this.state.action === "update" ? true : false} />
                                        </div>
                                        <div>
                                            <label for="tgl_check_out" class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-800">Tanggal Check Out</label>
                                            <input type="date" name="tgl_check_out" id="tgl_check_out" value={this.state.tgl_check_out} onChange={this.handleChange} class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-gray-800 block w-full p-2.5 dark:bg-white dark:border-gray-500 dark:placeholder-gray-400 dark:text-gray-800" placeholder="Masukkan password" required disabled={this.state.action === "update" ? true : false} />
                                        </div>
                                        <div>
                                            <label for="nama_tamu" class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-800">Nama Tamu</label>
                                            <input type="text" name="nama_tamu" id="nama_tamu" value={this.state.nama_tamu} onChange={this.handleChange} class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-gray-800 block w-full p-2.5 dark:bg-white dark:border-gray-500 dark:placeholder-gray-400 dark:text-gray-800" placeholder="Masukkan username user" required />
                                        </div>
                                        <div>
                                            <label for="jumlah_kamar" class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-800">Jumlah Kamar</label>
                                            <input type="number" name="jumlah_kamar" id="jumlah_kamar" value={this.state.jumlah_kamar} onChange={this.handleChange} class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-gray-800 block w-full p-2.5 dark:bg-white dark:border-gray-500 dark:placeholder-gray-400 dark:text-gray-800" placeholder="Masukkan username user" required />
                                        </div>

                                        <button type="submit" class="w-full text-white bg-blue-600 hover:bg-blue-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2">Simpan</button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </>
        )
    }
}