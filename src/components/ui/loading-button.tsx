import { Infinity } from 'ldrs/react'
import 'ldrs/react/Infinity.css'
function LoadingButton() {
  return (
    <Infinity
      size="25"
      stroke="4"
      strokeLength="0.15"
      bgOpacity="0.1"
      speed="1.3"
      color="black"
    />
  );
}

export default LoadingButton;
