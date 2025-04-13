import React from 'react';
import classes from 'src/app/ui/app/app.module.scss';
import { HomePage } from 'src/pages';

const App: React.FC = () => {
  return (
    <div className={classes.App}>
      <HomePage />
    </div>
  );
};

export default App;
