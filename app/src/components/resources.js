import React from "react";
import PropTypes from "prop-types";
import "./style.css";
import "./ChillMateLogo.png"
import Navbar from "./navbar";
import { Link } from "react-router-dom";

    const resourcesData = [
      {
        title: "Campus Academic and Student Life Resources",
        items: [
          {
            name: "CHHS Student Resource Center",
            url: "https://chss.sfsu.edu/src",
            description: [
            "The Undergraduate Advising Center (UAC) is the primary location for all undergraduate students seeking academic advising.", 
            "We are committed to supporting you and meeting your advising needs. We encourage you to meet with us to support your overall transition, wellness, and success at SF State.", 
            "Some of the common services we provide include, degree planning, choosing/registering for classes, major exploration,academic success strategies, and policy clarification and appeals.", 
            " We support students both virtually and in-person through advising appointments and drop-in."
            ],
          },

          {
            name: "Cesar Chavez Student Center",
            url: "https://sfsustudentcenter.com/",
            description: [
            "The Cesar Chavez Student Center is a non-profit supporting organization of San Francisco State University.",
            "The Cesar Chavez Student Center is located at the heart of campus and has been a dynamic hub of student activities since September 1975."
            ],
          },
        ],
      },
      {
        title: "Campus Health Resources",
        items: [
          {
            name: "Basic Needs",
            url: "https://basicneeds.sfsu.edu/",
            description: [
            "Food+Shelter+Success, SF State's Basic Needs Initiative, supports students’ ability to reach their full potential at SF State by providing food, housing and financial crisis support programs, services, and referrals.",
            "Food+Shelter+Success stands in solidarity with everyone fighting for equality.",
            "Equitable access to housing, food, medical care, and education are critical, undeniable, and foundational elements of racial and social justice."
            ],
          },
          {
            name: "Health Promotion and Wellness",
            url: "https://wellness.sfsu.edu/",
            description: [
            "Health Promotion & Wellness is a unit within Student Affairs & Enrollment Management that provides health education and actively promotes a culture of wellness.",
            "We create opportunities for students to enact healthy behaviors through advocacy, campaigns, programming, events, workshops, and peer health leadership programs.",
            "Our focus areas include alcohol, tobacco and other drugs, mental health, nutrition, sexual health, and emotional wellness.",
            "We work to achieve health equity and enhance academic, personal, and professional success for all members of the campus community."
            ],
          },
          {
            name: "Psychology Clinic",
            url: "https://psychology.sfsu.edu/clinical/psychological-services",
            description: [
            "We offer individual and group psychotherapy for a variety of problems.",
            "Clients seek our services for problems with depression, anxiety, adjustment to life stressors, and for relationship difficulties (to name a few).",
            "If you are unsure whether psychotherapy is right for you, come set an appointment with an intake therapist, discuss your concerns with him or her, and then decide at that time if it is something that can be helpful for you.",
            "There is no obligation to continue in therapy once you have come to the Psychology Clinic."
            ],
          },
          {
            name: "The SAFE Place",
            url: "https://dos.sfsu.edu/safeplace",
            description: [
            "The SAFE Place is a survivor-focused, trauma-informed program that provides FREE and CONFIDENTIAL support services to survivors of sexual assault, intimate partner violence, stalking, and sexual harassment (sexual violence) while working with campus partners to end sexual violence.",
            "We serve all members of the SFSU community including students, staff, and faculty.",
            "The SAFE Place recognizes that sexual violence impacts all people, regardless of race, ethnicity, age, gender, or sexual orientation and strives to foster a safe and welcoming environment.",
            "We are committed to addressing sexual violence within a social justice, anti-oppression framework.",
            "The SAFE Place helps survivors determine their own healing path by reviewing options for reporting, medical care, mental health care, alternative healing interventions, and empowering survivors to choose the path that feels right for them."
            ],
          },
        ],
      },
      {
        title: "Mental Health & Wellness Resources and Guides",
        items: [
          {
            name: "Guide to Mental Health Resources",
            url: "https://www.helpguide.org/",
            description: [
            "HelpGuide.org is an independent nonprofit that runs one of the world’s leading mental health websites.",
            "Each month, millions of people from all around the world turn to us for trustworthy information they can use to improve their mental health and make healthy changes."
            ],
          },
          {
            name: "Active Minds",
            url: "https://www.activeminds.org/",
            description: [
            "Active Minds is the nation’s premier nonprofit organization supporting mental health awareness and education for young adults."
            ],
          },
          {
            name: "Mindful",
            url: "https://www.mindful.org/category/health/covid-resources/",
            description: [
            "Covid resources to navigate the pandemic stress-free. Explore COVID-19 coping tips, mindfulness exercises, and self-care articles curated for you."
            ],
          },
          {
            name: "Hey Nod",
            url: "https://heynod.com/",
            description: [
            "Nod is the app for addressing college student loneliness and depression, bolstering social connection, and supporting mental health on campus."
            ],
          },
        ],
      },
      {
        title: "Talk & Chat Line Emotional Support Resources",
        items: [
          {
            name: "Talk & Chat Line Emotional Support Resources",
            url: "https://www.mentalhealthsf.org/warm-line/",
            description: [
            "The Warm Line provides accessible mental health support by using the wisdom of lived experience to connect, inspire hope, and empower our community toward unlimited recovery. We have provided assistance via phone and web chat to anyone in need since 2014.",
            "Some concerns callers share are challenges with interpersonal relationships, anxiety, pain, depression, finances, alcohol/drug use, etc."
            ],
          },
          {
            name: "SAMHSA Resources and Helpline",
            url: "https://www.samhsa.gov/find-help/national-helpline",
            description: "SAMHSA’s National Helpline is a free, confidential, 24/7, 365-day-a-year treatment referral and information service (in English and Spanish) for individuals and families facing mental and/or substance use disorders.",
          },
        ],
      },
    ];
    
    const Resources = () => (
      <div classname="resources">
        <Navbar />
        <div className="container" id="resources">
          
          <h1>Resources</h1>
          {resourcesData.map((section, sectionIndex) => (
            <div key={sectionIndex} className="left-align">
              <h2>{section.title}</h2>
              <ul>
                {section.items.map((item, itemIndex) => (
                  <li key={itemIndex}>
                    <a href={item.url} target="_blank" rel="noopener noreferrer">{item.name}</a>
                    <p>{item.description}</p>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    );
    
    export default Resources;