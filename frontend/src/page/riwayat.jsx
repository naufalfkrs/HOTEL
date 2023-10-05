import React from "react";
import Navbar from '../component/navbar_customer';
import axios from "axios"
import $ from "jquery";

export default class Beranda extends React.Component {
    render() {
        return (
            <>
                <Navbar />
                <div class=" flex justify-center items-center h-screen">
                    <div class="text-center">ini riwayat</div>
                </div>
            </>
        )
    }
}