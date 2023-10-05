import React from "react";
import Navbar from '../component/navbar_customer';
import axios from "axios"
import $ from "jquery";

export default class Beranda extends React.Component {

    render() {
        return (
            <>
                <Navbar />
                <div class="flex items-center justify-center h-screen">
                    <div class="w-[50vw] h-[45vh] bg-blue-500 rounded-md">
                        <div className="flex items-center justify-center h-screen">
                            <div className="w-[200px] h-[200px] bg-blue-500 rounded-md">
                                {/* Konten di dalam kotak */}
                                <DatePicker
                                    selected={startDate}
                                    onChange={(date) => setStartDate(date)}
                                    startDate={startDate}
                                    endDate={endDate}
                                    selectsStart
                                    isClearable
                                />
                                <DatePicker
                                    selected={endDate}
                                    onChange={(date) => setEndDate(date)}
                                    startDate={startDate}
                                    endDate={endDate}
                                    selectsEnd
                                    isClearable
                                />
                            </div>
                        </div>
                    </div>
                </div>


            </>
        )
    }
}