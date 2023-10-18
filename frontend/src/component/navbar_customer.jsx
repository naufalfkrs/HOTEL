import React from "react";
import { NavLink } from "react-router-dom"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default class Navbar extends React.Component {
    constructor() {
        super()
        this.state = {
            role: "",

        }
        this.state.role = localStorage.getItem("role")
    }

    logOut = () => {
        localStorage.clear()
        localStorage.removeItem("id")
        localStorage.removeItem("token")
        localStorage.removeItem("role")
        localStorage.removeItem("email")
        localStorage.removeItem("username")
        window.location = '/'
    }

    checkRole = () => {
        if (this.state.role === "admin") {
            window.location = '/kamar'
        } else if (this.state.role === "resepsionis") {
            window.location = '/history'
        }
    }

    componentDidMount() {
        this.checkRole()
    }
    render() {
        return (
            <nav className="bg-gray-800 flex justify-between px-10 items-center h-16 fixed top-0 left-0 right-0 z-50">
                <h3 className="text-white font-bold text-xl">Hotel. Customer</h3>
                <ul className="flex gap-8 text-white">
                    <li><NavLink to='/beranda'>Beranda</NavLink></li>
                    <li><NavLink to='/riwayat'>Riwayat</NavLink></li>
                    <li><NavLink to='/'><span className="ml-2" onClick={() => this.logOut()}>Log Out</span></NavLink></li>
                </ul>
            </nav>

        )
    }

}