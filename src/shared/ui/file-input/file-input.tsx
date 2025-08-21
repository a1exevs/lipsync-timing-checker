import { Nullable, Optional } from '@alexevs/ts-guards';
import React, { forwardRef } from 'react';

type Props = {
  accept: Optional<string>;
  handleFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  dataTestId?: string;
};

const FileInput: React.ForwardRefExoticComponent<Props & React.RefAttributes<Nullable<HTMLInputElement>>> = forwardRef(
  ({ handleFileUpload, accept, dataTestId }, ref) => {
    return (
      <input
        type="file"
        ref={ref}
        accept={accept}
        onChange={handleFileUpload}
        style={{ display: 'none' }}
        data-testid={dataTestId}
      />
    );
  },
);

export default FileInput;
