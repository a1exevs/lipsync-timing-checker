import React from 'react';

import { HomePage } from 'src/pages';
import { DialogProvider } from 'src/shared';

const App: React.FC = () => {
  return (
    <div className="bg-[rgba(24,26,27,0.75)] mx-auto max-w-[1920px] min-h-screen p-0">
      <DialogProvider>
        <HomePage />
      </DialogProvider>
    </div>
  );
};

export default App;
