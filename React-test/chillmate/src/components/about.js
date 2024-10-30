import React from "react";
import Navbar from "./navbar";
import logo from "./ChillMateLogo.png";
import luisImage from "./LuisCarrillo.JPG";
import gioImage from "./GioJung.jpg";
import eifImage from "./Eiffel.jpg";
import mentalHealthImage from "./mentalhealth.png";
import ss1Image from "./SS1.jpg";
import ss2Image from "./ss2.jpg";
import ss4Image from "./ss4.jpg";
import ss5Image from "./ss5.jpg";

// ... rest of your imports

export default class About extends React.Component {
    render() {
        return (
            <div>
                <Navbar />
                <div className="container" id="home">
                    <table width="100%" cellSpacing="0" cellPadding="5">
                        <tbody>
                            <tr>
                                <td align="center" colSpan="2" >
                                    <h1>All About ChillMate</h1>
                                </td>
                            </tr>
                            <tr>
                                {/* Left column: Images */}
                                <td valign="top">
                                    <img src={ss1Image} width="600" height="150" alt="ChillMate" />
                                    <br />
                                    <table cellSpacing="0" cellPadding="0" border="0">
                                        <tbody>
                                            <tr>
                                                <td><img src={ss2Image} alt="Image 2" width="300" height="200" /></td>
                                                <td><img src={ss4Image} alt="Image 4" width="300" height="200" /></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </td>
                                {/* Right column: Text */}
                                <td valign="top">
                                    <p className="gradient-text">
                                        Breaking Cycle: Empower Your Thoughts, Transform Your Feelings, Control Your Situation
                                    </p>
                                    <div className="float-center">
                                        <img src={ss5Image} width="300" height="300" alt="Mental Wellness" />
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>

                    <div className="radial-gradient-text" style={{ backgroundColor: '#DEDDFF', padding: '20px' }}>
                        <span className="gradient-text2">
                            ChillMate is your pocket-sized support for mental wellness amidst the chaos, offering quick and effective strategies to help you manage stress and anxiety - all designed to fit seamlessly into your busy lifestyle.
                        </span>
                    </div>
                    <br /><br />
                    <table cellSpacing="0" cellPadding="0" border="0" width="100%">
                        <tbody>
                            <tr>
                                <td><img src={mentalHealthImage} alt="Mental Health" width="100%" /></td>
                            </tr>
                        </tbody>
                    </table>
                    <div className="gradient-text2">
                        <h2>Why do we do this?</h2>
                        <p> We understand the pressures of balancing academics, teaching, and maintaining mental wellness. We have experienced the challenges students and teachers face, from juggling deadlines to handling stress. We created ChillMate - a campus-specific, all-in-one solution that provides quick access to mental health support. Whether you are seeking strategies to manage anxiety, looking for instant stress relief, or simply need a space to reflect, ChillMate is here to help.</p>

                    </div>


{/* Profile Page */}
<div className="container">
    <h2 className="gradient-text4">Meet the Team</h2>
    <div className="profile-grid">
        {[
            {
                title: 'Teammate 1 (Front-end Leader)',
                name: 'Chun Kai Liu',
                introduction: 'Hello, my name is Chun Kai Liu and I\'m a senior Computer Science major at SFSU. In my free time, I like to work out and play games.'
            },
            {
                title: 'Teammate 2 (GitHub Master)',
                name: 'Luis Carrillo',
                introduction: 'Hello, my name is Luis Carrillo and I\'m a senior Computer Science major at SFSU. In my free time I like to play basketball or soccer.',
                image: luisImage
            },
            {
                title: 'Teammate 3 (Back-end Lead)',
                name: 'William Widjaja',
                introduction: 'Hi, my name is William Widjaja and I\'m a senior Computer Science major at SFSU. In my free time, I like to play games and listen to music.'
            },
            {
                title: 'Teammate 4 (Back-end Member)',
                name: 'Jay Lodha',
                introduction: 'I\'m a Grad student pursuing Data Science and AI. I have worked as a ML Engineer for 2 years at a document AI firm before commencing my masters. I like playing basketball whenever I can.'
            },
            {
                title: 'Teammate 5',
                name: 'Sneha Katturu',
                introduction: 'Hi all, I am Sneha, a graduate student with majors in Computer Science. During my free time I like to play badminton.'
            },
            {
                title: 'Teammate 6 (Team Leader)',
                name: 'Eiffel Valentino',
                introduction: 'Hello everyone, my name is Eiffel and I am an Undergrad Senior Computer Science student. I personally like traveling and watching YouTube videos about food, travel, and technology.',
                image: eifImage
            },
            {
                title: 'Teammate 7 (Scrum Master)',
                name: 'Gio Jung',
                introduction: 'Hello, I\'m currently in the master\'s program in Computer Science and my role in this project is a Scrum Master. My personal hobby is listening to music and running.',
                image: gioImage
            }
        ].map((teammate, index) => (
            <div key={index} className="profile-card">
                <h3 className="gradient-text3">{teammate.title}</h3>
                <p><strong>Name:</strong> {teammate.name}</p>
                <p><strong>Introduction:</strong> {teammate.introduction}</p>
                {teammate.image && <img src={teammate.image} alt={teammate.name} className="profile-image" />}
            </div>
        ))}
    </div>
</div>

                    
                    
                </div>
            </div>
        );
    }
}