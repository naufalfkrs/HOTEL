import React from 'react'
import Navbar from '../component/navbar'
import axios from "axios"
import $ from "jquery";

export default class Room extends React.Component {

    constructor() {
        super()
        this.state = {
            room: [],
            typeroom: [],
            id: "",
            nomor_kamar: "",
            id_tipe_kamar: "",
            role: "",
            token: "",
            action: "",
            keyword: ""
        }

        if (localStorage.getItem("token")) {
            if (localStorage.getItem("role") === "admin" ) {
                this.state.token = localStorage.getItem("token")
                this.state.role = localStorage.getItem("role")
            } else if (localStorage.getItem("role") === "resepsionis" ) {
                window.location = "/history"
            } else if (localStorage.getItem("role") === "customer" ) {
                window.location = "/beranda"
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

    handleClose = () => {
        $("#modal_room").hide()
    }

    _handleFilter = () => {
        let data = {
            nomor_kamar: this.state.nomor_kamar,
        }
        let url = "http://localhost:8000/kamar/find/"
        axios.post(url, data)
            .then(response => {
                if (response.status === 200) {
                    this.setState({
                        room: response.data.data
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

    handleAdd = () => {
        $("#modal_room").show()
        this.setState({
            id: "",
            nomor_kamar: "",
            id_tipe_kamar: "",
            action: "insert"
        })
    }

    handleEdit = (item) => {
        $("#modal_room").show()
        this.setState({
            id: item.id,
            nomor_kamar: item.nomor_kamar,
            id_tipe_kamar: item.id_tipe_kamar,
            action: "update"
        })
    }

    handleSave = (e) => {
        e.preventDefault()

        let form = {
            id: this.state.id,
            nomor_kamar: this.state.nomor_kamar,
            id_tipe_kamar: this.state.id_tipe_kamar
        }

        if (this.state.action === "insert") {
            let url = "http://localhost:8000/kamar/"
            axios.post(url, form, this.headerConfig())
                .then(response => {
                    this.getRoom()
                    this.handleClose()
                })
                .catch(error => {
                    console.log("error add data", error.response.status)
                    if (error.response.status === 500) {
                        window.alert("Failed to add data");
                    }
                })
        } else {
            let url = "http://localhost:8000/kamar/" + this.state.id
            axios.put(url, form, this.headerConfig())
                .then(response => {
                    this.getRoom()
                    this.handleClose()
                })
                .catch(error => {
                    console.log(error)
                })
        }
    }

    handleDrop = (id) => {
        let url = "http://localhost:8000/kamar/" + id
        if (window.confirm("Are you sure to delete this room")) {
            axios.delete(url, this.headerConfig())
                .then(response => {
                    console.log(response.data.message)
                    this.getRoom()
                })
                .catch(error => {
                    if (error.response.status === 500) {
                        window.alert("You can't delete this data");
                    }
                })
        }
    }

    getRoom = () => {
        let url = "http://localhost:8000/kamar"
        axios.get(url, this.headerConfig())
            .then(response => {
                this.setState({
                    room: response.data.data
                })
                console.log(response.data.data)
            })
            .catch(error => {
                console.log(error)
            })
    }

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
        if (this.state.role === "resepsionis") {
            window.location = '/history'
        } else if (this.state.role === "customer") {
            window.location = '/beranda'
        }
    }

    componentDidMount() {
        this.getRoom()
        this.getTypeRoom()
        this.checkRole()
    }

    render() {
        return (
            <>
                <Navbar />

                    <div class="my-6">
                        <div className="mt-28 flex justify-center">
                            <h3 className="text-2xl">Kamar List</h3>
                        </div>

                        <div className="flex justify-center mr-4">
                            <div className="flex rounded w-3/4 mt-7 mb-5">
                                <button className="w-1/6 ml-2 px-3 py-2 text-white bg-blue-600 rounded hover:bg-blue-700" onClick={() => this.handleAdd()}>
                                    Add +
                                </button>
                            </div>
                        </div>

                        <table className="w-3/4 mx-auto shadow-2xl">
                            <thead>
                                <tr>
                                    <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider">No</th>
                                    <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider">Room Number</th>
                                    <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider">Room Type</th>
                                    <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.room.map((item, index) => {
                                    return (
                                        <tr key={index}>
                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                <div className="text-sm text-gray-900">{index + 1}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                <div className="text-sm font-medium text-gray-900">
                                                    Room-{item.nomor_kamar}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-indigo-100 text-indigo-800">
                                                    {item.nama_tipe_kamar}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                <button class="bg-green-600 hover:bg-green-700 text-white py-1 px-2 rounded mr-2" onClick={() => this.handleEdit(item)}>
                                                    Edit
                                                </button>
                                                <button class="bg-red-500 hover:bg-red-700 text-white py-1 px-2 rounded" onClick={() => this.handleDrop(item.id)}>
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>

                    </div>

                {/* Modal Form */}
                <div id="modal_room" tabindex="-1" aria-hidden="true" class="overflow-x-auto fixed top-0 left-0 right-0 z-50 hidden w-full p-4 md:inset-0 h-modal md:h-full bg-tranparent bg-black bg-opacity-50">
                    <div class="flex lg:h-auto w-auto justify-center ">
                        <div class="relative bg-white rounded-lg shadow dark:bg-white w-1/3">
                            <button type="button" class="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white" onClick={() => this.handleClose()}>
                                <svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
                                <span class="sr-only">Tutup modal</span>
                            </button>
                            <div class="px-6 py-6 lg:px-8">
                                <h3 class="mb-4 text-xl font-medium text-gray-900 dark:text-black">Kamar</h3>
                                <form class="space-y-6" onSubmit={(event) => this.handleSave(event)}>
                                    <div>
                                        <label for="id_tipe_kamar" class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-800">Tipe Kamar</label>
                                        <select className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-gray-800 block w-full p-2.5 dark:bg-white dark:border-gray-500 dark:placeholder-gray-400 dark:text-black" placeholder="Type Room" name="id_tipe_kamar" value={this.state.id_tipe_kamar} onChange={this.handleChange} required>
                                            <option value="">Pilih Tipe Kamar</option>
                                            {this.state.typeroom.map((item, index) => (
                                                <option value={item.id}>{item.nama_tipe_kamar}</option>

                                            ))}
                                        </select>
                                    </div>
                                    <button type="submit" class="w-full text-white bg-blue-600 hover:bg-blue-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2">Simpan</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}