import React, { useMemo } from 'react';

import { Content } from 'src/shared/ui/confirmation-dialog/confirmation-dialog.compounds';
import { MaybeRenderProp } from 'src/shared/ui/confirmation-dialog/confirmation-dialog.types';

const useContentNode = ({
  renderMaybe,
  content,
  message,
  title,
}: {
  renderMaybe: (node?: MaybeRenderProp) => React.ReactNode;
  content?: MaybeRenderProp;
  message?: string;
  title: string;
}): React.ReactNode => {
  return useMemo(() => {
    const custom = renderMaybe(content);
    if (custom) {
      return custom;
    }
    return <Content message={message} />;
  }, [renderMaybe, content, message, title]);
};

export default useContentNode;
