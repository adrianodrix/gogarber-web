import React from 'react';
import { Link } from 'react-router-dom';

// import { Container } from './styles';

export default function NotFound() {
  return (
    <div>
      <center>
        <h1>Page Not Found</h1>
        <Link to="/">Return to Home Page</Link>
      </center>
    </div>
  );
}
