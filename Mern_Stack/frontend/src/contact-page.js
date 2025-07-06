import React, { useState, useEffect} from "react";
import { Form, Link } from "react-bootstrap";
import { Button, Alert } from "react-bootstrap";


function Contact() {
  const [showMessage, setShowMessage] = useState(false);

  const handleContactClick = () => {
    setShowMessage(true);
  };

  const teamMembers = [
    { name: "Courtney Cook", email: 'codee.withcadee@byte.com' },
    { name: "Lindokuhle Yende", email: 'lindo.logic@neuralhub.org' },
    { name: "Pierre Kahunda", email: 'pierrefect.code@bonjour.dev' },
    { name: "Tom Vuma", email: 'tom.tornado@scriptstorm.dev' },
    { name: "Ulrich Snyman", email: 'ultimatecoding@master.com' },
  ];
   return (
    <div className="container mt-5">
      <h2>Contact Us</h2>
      <Button variant="primary" onClick={handleContactClick}>
        Need Help?
      </Button>

      {showMessage && (
        <Alert variant="success" className="mt-4">
          <p>Thanks for reaching out! One of our team members will be in contact shortly:</p>
          <ul>
            {teamMembers.map((person, index) => (
              <li key={index}>
                <strong>{person.name}</strong>: {person.email}
              </li>
            ))}
          </ul>
        </Alert>
      )}
    </div>
  );
}

export default Contact;