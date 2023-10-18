import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import axios from 'axios'

export default class Login extends React.Component {
    constructor() {
        super()
        this.state = {
            email_user: "",
            password_user: "",
            isModalOpen: false,  
            logged: false,
        }
    }

    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    handleLogin = (e) => {
        e.preventDefault()
        let data = {
            email: this.state.email_user,
            password: this.state.password_user
        }
        let url = "http://localhost:8000/user/login"
        axios.post(url, data)
            .then(response => {
                this.setState({ logged: response.data.data.logged })
                if (response.status === 200) {
                    let id = response.data.data.id
                    let token = response.data.data.token
                    let role = response.data.data.role
                    let email = response.data.data.email
                    let nama_user = response.data.data.nama_user
                    localStorage.setItem("id", id)
                    localStorage.setItem("token", token)
                    localStorage.setItem("role", role)
                    localStorage.setItem("email", email)
                    localStorage.setItem("username", nama_user)
                    alert("Success Login")
                    if(role === 'admin'){
                        window.location.href = "/kamar"
                    }else if(role === 'resepsionis'){
                        window.location.href = "/history"
                    }else if(role === 'customer'){
                        window.location.href = "/beranda"
                    }
                    
                } else {
                    alert(response.data.message)
                    this.setState({ message: response.data.message })

                }
            })
            .catch(error => {
                console.log("error", error.response.status)
                if (error.response.status === 500 || error.response.status === 404) {
                    window.alert("Failed to login");
                }
            })
    }

    render() {
        return (
            <div className="dashboard1">
                <div class="flex">
                    <div class="h-screen w-full bg-gray-200 text-left">
                        <form class="bg-gray-100 shadow-md rounded px-8 pt-6 p-8 m-24 mt-30 w-1/2 mx-auto " onSubmit={(e) => this.handleLogin(e)}>
                            <p class="text-gray-700 text-2xl font-bold mb-8 text-center">Hotel.</p>
                            <div class="mb-4">
                                <label class="block text-gray-700 text-sm font-bold mb-2" for="email">
                                    Email
                                </label>
                                <input class="shadow appearance-none border rounded w-full py-4 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" id="email_user" name="email_user" placeholder="Email" value={this.state.email_user} onChange={this.handleChange} required />
                            </div>
                            <div class="mb-6">
                                <label class="block text-gray-700 text-sm font-bold mb-2" for="password">
                                    Password
                                </label>
                                <input class="shadow appearance-none border rounded w-full py-4 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" id="password" name="password_user" type="password" placeholder="Password" value={this.state.password_user} onChange={this.handleChange} required />
                            </div>
                            <div class="flex items-center justify-between mb-6">
                                <button class="bg-gray-800 hover:bg-gray-500 text-white font-bold py-2 w-full rounded focus:outline-none focus:shadow-outline" type="submit">
                                    Sign In
                                </button>
                            </div>
                            <div>
                                <p class="text-gray-700 text-l text-center">Don't have an account?
                                    <a href="" class="font-bold"> Sign Up</a>
                                </p>
                            </div>
                        </form>
                    </div>

                </div>
            </div>
        );
    }
}