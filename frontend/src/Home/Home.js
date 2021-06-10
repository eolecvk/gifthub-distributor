import React, { Component } from 'react'
import { Helmet } from "react-helmet";
import HomeMenu from './HomeMenu'


function Home() {
    return (
        <div className="home">
            <Helmet>
                <title>Home</title>
                <meta
                    name="viewport"
                    content="minimum-scale=1, initial-scale=1, width=device-width"
                />
            </Helmet>
            <HomeMenu />
        </div>
    )
}

export default Home;
