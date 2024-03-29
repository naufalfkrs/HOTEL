import React from "react";
import { NavLink } from "react-router-dom"

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
        if (this.state.role === "customer") {
            window.location = '/beranda'
        }
    }

    componentDidMount() {
        this.checkRole()
    }
    render() {
        return (
            <nav className="bg-gray-800 flex justify-between px-10 items-center h-16 fixed top-0 left-0 right-0 z-50">
                <h3 className="text-white font-bold text-xl">Hotel.</h3>
                <ul className="flex gap-8 text-white">
                {
                    this.state.role === "admin" &&
                    <li><NavLink to='/user'>User</NavLink></li>
                } {
                    this.state.role === "admin" &&
                    <li><NavLink to='/kamar'>Kamar</NavLink></li>
                } {
                    this.state.role === "admin" &&
                    <li><NavLink to='/tipe_kamar'>Tipe Kamar</NavLink></li>
                } {
                    this.state.role === "resepsionis" &&
                    <li><NavLink to='/history'>History</NavLink></li>
                }
                    <li><NavLink to='/'><span className="ml-2" onClick={() => this.logOut()}>Logout</span></NavLink></li>
                </ul>
            </nav>

        )
    }

}