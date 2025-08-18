import React, { useMemo } from 'react';

import { Header } from 'src/shared/ui/confirmation-dialog/confirmation-dialog.compounds';
import { MaybeRenderProp } from 'src/shared/ui/confirmation-dialog/confirmation-dialog.types';

const useHeaderNode = ({
  renderMaybe,
  header,
  title,
  titleId,
  handleCancel,
}: {
  renderMaybe: (node?: MaybeRenderProp) => React.ReactNode;
  header?: MaybeRenderProp;
  title: string;
  titleId: string;
  handleCancel: () => void;
}): React.ReactNode => {
  return useMemo(() => {
    const custom = renderMaybe(header);
    if (custom) {
      return custom;
    }
    return <Header title={title} titleId={titleId} handleCancel={handleCancel} />;
  }, [renderMaybe, header, title, titleId, handleCancel]);
};

export default useHeaderNode;
