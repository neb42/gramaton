import { createRoot } from 'react-dom/client';

import { Root } from './Root';

import './index.css';

const init = () => {
  const rootContainer = document.querySelector("#__root");
  if (!rootContainer) throw new Error("Can't find Popup root element");
  const root = createRoot(rootContainer);
  root.render(<Root />);
};

init();