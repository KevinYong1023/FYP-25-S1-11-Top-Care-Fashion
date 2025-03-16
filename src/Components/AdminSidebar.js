// import React from 'react';
// import { Nav } from 'react-bootstrap';
// import { House, Person, Eye, BoxArrowRight } from 'react-bootstrap-icons'; // or react-icons

// export default function Sidebar(){
//     return (
//         <div style={{ 
//             width: '250px', 
//             height: '100vh', 
//             backgroundColor: '#343a40',  // Lighter black (dark grey)
//             padding: '20px', 
//             boxShadow: '2px 0 6px rgba(0, 0, 0, 0.2)',  // Subtle shadow for depth
//         }}>
//           <Nav className="flex-column">
//             <Nav.Link href="/dashboard" style={{ color: 'white', marginBottom: '10px' }}>
//                 <House style={{ marginRight: '10px' }} /> Dashboard
//             </Nav.Link>
//             <Nav.Link href="/profile" style={{ color: 'white', marginBottom: '10px' }}>
//                 <Person style={{ marginRight: '10px' }} /> Profile
//             </Nav.Link>
//             <Nav.Link href="/view-accounts" style={{ color: 'white', marginBottom: '10px' }}>
//                 <Eye style={{ marginRight: '10px' }} /> View Account
//             </Nav.Link>
//             <Nav.Link href="/logout" style={{ color: 'white', marginBottom: '10px' }}>
//                 <BoxArrowRight style={{ marginRight: '10px' }} /> Logout
//             </Nav.Link>
//         </Nav>

//         </div>
//     );
// };

import React, { useState } from 'react';
import { Nav } from 'react-bootstrap';
import { House, Person, Eye, BoxArrowRight, ChevronDown, ChevronUp, Trash, PersonAdd} from 'react-bootstrap-icons'; // or react-icons

export default function AdminSidebar(){

    const [isSubmenuOpen, setIsSubmenuOpen] = useState(false);


    return (
        <div style={{ 
            width: '250px', 
            height: '100vh', 
            backgroundColor: '#343a40',  // Lighter black (dark grey)
            padding: '20px', 
            boxShadow: '2px 0 6px rgba(0, 0, 0, 0.2)',  // Subtle shadow for depth
        }}>
          <Nav className="flex-column">
            <Nav.Link href="/profile" style={{ color: 'white', marginBottom: '10px' }}>
                <Person style={{ marginRight: '10px' }} /> Profile
            </Nav.Link>

            <Nav.Link href="" style={{ color: 'white', marginBottom: '10px' }}>
                <PersonAdd style={{ marginRight: '10px' }} /> Create Account
            </Nav.Link>

            <Nav.Link href="/view-all-accounts" style={{ color: 'white', marginBottom: '5px' }}>
                    <Eye style={{ marginRight: '10px' }} /> View Account 
            </Nav.Link> 
               <div style={{ paddingLeft: '30px' }}>
                    <Nav.Link href="/view-all-accounts-admin" style={{ color: 'white', marginBottom: '5px' }}>
                        - Admin
                    </Nav.Link>
                    <Nav.Link href="/view-all-accounts-user" style={{ color: 'white', marginBottom: '5px' }}>
                        - User
                    </Nav.Link>
                    <Nav.Link href="/view-all-accounts-manager" style={{ color: 'white', marginBottom: '5px' }}>
                        - Manager
                    </Nav.Link>
                    <Nav.Link href="/view-all-accounts-customersupport" style={{ color: 'white', marginBottom: '5px' }}>
                        - Customer Support
                    </Nav.Link>
                </div>


            <Nav.Link href="" style={{ color: 'white', marginBottom: '10px' }}>
                <Trash style={{ marginRight: '10px' }} /> Delete Account
            </Nav.Link>

            <Nav.Link href="/logout" style={{ color: 'white', marginBottom: '10px' }}>
                <BoxArrowRight style={{ marginRight: '10px' }} /> Logout
            </Nav.Link>

        </Nav>

        </div>
    );
};

