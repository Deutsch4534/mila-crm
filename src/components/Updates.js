import React from 'react';
import NavLoggedOut from './NavLoggedOut';

const Updates = () => (
  <div>
    <NavLoggedOut />
    <div className="tl ph3 ph5-ns ph7-l">
      <h1>Updates</h1>
      <p>
        Mila is a solo project made in 🇪🇨 Ecuador by me,{' '}
        <a href="https://twitter.com/danparamov" className="black">
          Daniel Paramo
        </a>
      </p>
      <p>
        Here is my{' '}
        <a
          href="https://www.notion.so/kitcrm/Our-Roadmap-a1f5ad4f560045488e579cb3ccbd6f6f"
          className="black"
        >
          Roadmap
        </a>
        , you can add feature requests if you want!
      </p>
    </div>
  </div>
);

export default Updates;
