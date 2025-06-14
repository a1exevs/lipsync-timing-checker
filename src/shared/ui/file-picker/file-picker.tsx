import React, { ReactNode, useRef } from 'react';
import Button from 'src/shared/ui/button/button';
import { FileAudio } from 'lucide-react';
import FileInput from 'src/shared/ui/file-input/file-input';
import { Nullable, Optional } from '@alexevs/ts-guards';

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
    <div className="flex flex-col gap-1 w-48">
      <Button
        text={text}
        icon={icon}
        onClick={() => {
          fileRef.current?.click();
        }}
        disabled={disabled}
      />
      {fileName && (
        <span className="block w-full truncate text-sm text-gray-300" title={fileName}>
          {fileName}
        </span>
      )}
      <FileInput ref={fileRef} accept={accept} handleFileUpload={handleFileUpload} />
    </div>
  );
};

export default FilePicker;
