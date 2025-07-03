import { Nullable } from '@alexevs/ts-guards';
import React, { ReactNode, useRef } from 'react';

import Button from 'src/shared/ui/button/button';
import FileInput from 'src/shared/ui/file-input/file-input';

type Props = {
  text: string;
  handleFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  accept?: string;
  fileName?: string;
  icon?: ReactNode;
  disabled?: boolean;
};

const FilePicker: React.FC<Props> = ({
  accept = '*/*',
  handleFileUpload,
  fileName = '',
  text,
  icon,
  disabled = false,
}) => {
  const fileRef = useRef<Nullable<HTMLInputElement>>(null);
  return (
    <div className="flex flex-row gap-2 items-center">
      <Button
        additionalClasses="w-1/2"
        text={text}
        icon={icon}
        onClick={() => {
          fileRef.current?.click();
        }}
        disabled={disabled}
      />
      {fileName && (
        <span className="flex-1 block truncate text-sm text-gray-300" title={fileName}>
          {fileName}
        </span>
      )}
      <FileInput ref={fileRef} accept={accept} handleFileUpload={handleFileUpload} />
    </div>
  );
};

export default FilePicker;
