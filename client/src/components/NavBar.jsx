import React, { useLayoutEffect } from "react";
import "./NavBar.css"

function NavBar() {

    useLayoutEffect(() => {
        let menuOpen = false;
        let hamburgerMenu = document.querySelector('.menu');
        let hamburger = document.querySelector('.hamburger');
        hamburgerMenu.addEventListener('touchstart', e => {
            if (menuOpen) {
                hamburger.classList.remove('open');
                menuOpen = false;
            }
            else {
                hamburger.classList.add('open');
                menuOpen = true;
            }
        })
    })

    return (
        <nav>
            <h1>Number Recogniser</h1>
            <ul>
                <li><a href="https://github.com/Mr00Magician/Number-Recogniser">Github Repo</a></li>
                <li><a href="https://me-anas-nadeem.carrd.co">Other Projects</a></li>
            </ul>
            <div className="menu">
                <div className="hamburger"></div>
            </div>
        </nav>
    )
}

export default NavBar;