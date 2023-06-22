import React, { useLayoutEffect } from "react";
import "./NavBar.css"

function NavBar() {

    useLayoutEffect(() => {
        let menuOpen = false;
        let hamburgerMenu = document.querySelector('.menu');
        let hamburger = document.querySelector('.hamburger');
        let navLinks = document.querySelector('nav > ul');
        hamburgerMenu.addEventListener('touchstart', e => {
            if (menuOpen) {
                hamburger.classList.remove('open');
                navLinks.classList.remove('show');
                navLinks.classList.add('hide');
                menuOpen = false;
            }
            else {
                hamburger.classList.add('open');
                navLinks.classList.remove('hide');
                navLinks.classList.add('show');
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