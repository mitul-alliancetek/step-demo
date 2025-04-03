import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { DocumentView } from 'src/sections/documents/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Documents - ${CONFIG.appName}`}</title>
      </Helmet>

      <DocumentView />
    </>
  );
}
