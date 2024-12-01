import React from "react";
import PropTypes from "prop-types";
import "./style.css";
import "./ChillMateLogo.png"

const resourcesData = [
  {
    title: "Campus Academic and Student Life Resources",
    items: [
      {
        name: "CHHS Student Resource Center",
        url: "https://chss.sfsu.edu/src",
        description: [
          "- The Undergraduate Advising Center (UAC) is the central hub for undergraduate students seeking academic advising.",
          "- Dedicated to assisting students with their transition, wellness, and overall academic success.",
          "- Services provided include:",
          "\t • Degree planning, Choosing and registering for classes, Major exploration, Academic success strategies, Policy clarification and appeals",
          "- Support is available both virtually and in-person through advising appointments and drop-in sessions."
        ],
      },

      {
        name: "Cesar Chavez Student Center",
        url: "https://sfsustudentcenter.com/",
        description: [
          "- The Cesar Chavez Student Center is a non-profit supporting organization of San Francisco State University.",
          "- The Cesar Chavez Student Center is located at the heart of campus and has been a dynamic hub of student activities since September 1975."
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
          "- Supports students’ ability to reach their full potential at SF State through resources like:",
          "\t • Food assistance, Housing support, Financial crisis programs and referrals",
          "- Advocates for equitable access to:",
          "\t • Housing, food, medical care, and education",
          "- Stands in solidarity with equality and social justice"
        ],
      },
      {
        name: "Health Promotion and Wellness",
        url: "https://wellness.sfsu.edu/",
        description: [
          "- Promotes health education and a culture of wellness at SF State.",
          "- Opportunities for healthy behaviors through:",
          "\t • Advocacy, events, workshops, and campaigns, Peer health leadership programs",
          "- Focus Areas: Alcohol and drug education, Mental health, Nutrition, Sexual and emotional wellness",
          "- Achieves health equity to enhance academic, personal, and professional success."
        ],
      },
      {
        name: "Psychology Clinic",
        url: "https://psychology.sfsu.edu/clinical/psychological-services",
        description: [
          "- Offers individual and group psychotherapy for:",
          "\t • Depression, Anxiety, Adjustment to life stressors, Relationship difficulties",
          "- Provides intake appointments to discuss concerns and explore therapy options.",
          "- No obligation to continue therapy after the initial session."
        ],
      },
      {
        name: "The SAFE Place",
        url: "https://dos.sfsu.edu/safeplace",
        description: [
          "- Provides FREE and CONFIDENTIAL support to survivors of:",
          "\t • Sexual assault, Intimate partner violence, Stalking, Sexual harassment",
          "- Offers reporting assistance, medical care, and mental health resources.",
          "- Uses a social justice and anti-oppression framework to end sexual violence.",
          "- Serves all members of the SFSU community (students, staff, faculty).",
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
          "- HelpGuide.org is an independent nonprofit that runs one of the world’s leading mental health websites.",
          "- Each month, millions of people from all around the world turn to us for trustworthy information they can use to improve their mental health and make healthy changes."
        ],
      },
      {
        name: "Active Minds",
        url: "https://www.activeminds.org/",
        description: [
          "- Active Minds is the nation’s premier nonprofit organization supporting mental health awareness and education for young adults."
        ],
      },
      {
        name: "Mindful",
        url: "https://www.mindful.org/category/health/covid-resources/",
        description: [
          "- Covid resources to navigate the pandemic stress-free. Explore COVID-19 coping tips, mindfulness exercises, and self-care articles curated for you."
        ],
      },
      {
        name: "Hey Nod",
        url: "https://heynod.com/",
        description: [
          "- Nod is the app for addressing college student loneliness and depression, bolstering social connection, and supporting mental health on campus."
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
          "- The Warm Line offers accessible mental health support through phone and web chat.",
          "- Provides assistance using lived experiences to inspire hope and empower recovery.",
          "- Common concerns include:",
          "\t • Interpersonal relationships",
          "\t • Anxiety and depression",
          "\t • Pain and finances",
          "\t • Alcohol or drug use"
        ],
      },
      {
        name: "SAMHSA Resources and Helpline",
        url: "https://www.samhsa.gov/find-help/national-helpline",
        description: [
          "- SAMHSA’s National Helpline is free, confidential, and available 24/7, year-round.",
          "- Offers treatment referrals and information in English and Spanish.",
          "- Supports individuals and families facing mental health or substance use disorders."
        ],
      },
    ],
  },
];

const Resources = ({ numberOfColumns }) => {
  const columnClass = `${numberOfColumns}-columns`; // Generate class dynamically

  return (
    <div className="resources">
      <div className="container" id="resources">
        <h1>Resources</h1>
        <h1></h1>
        <div className={`columns ${columnClass}`}>
          {resourcesData.map((section, sectionIndex) => (
            <div key={sectionIndex} className="column">
              <h2>{section.title}</h2>
              <ul>
                {section.items.map((item, itemIndex) => (
                  <li key={itemIndex}>
                    <a href={item.url} target="_blank" rel="noopener noreferrer">
                      {item.name}
                    </a>
                    <div>
                      {/* Map through description and render each line properly */}
                      {Array.isArray(item.description) ? (
                        item.description.map((line, lineIndex) => {
                          if (line.startsWith("\t")) {
                            // Indented lines with tab ("\t") for sub-points
                            return (
                              <p key={lineIndex} style={{ marginLeft: "20px" }}>
                                {line.trim()}
                              </p>
                            );
                          } else if (line.startsWith("-")) {
                            // Top-level bullet points
                            return <p key={lineIndex}>{line}</p>;
                          } else {
                            // Default paragraph for other text
                            return <p key={lineIndex}>{line}</p>;
                          }
                        })
                      ) : (
                        <p>{item.description}</p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

Resources.propTypes = {
  numberOfColumns: PropTypes.number.isRequired,
};

export default Resources;