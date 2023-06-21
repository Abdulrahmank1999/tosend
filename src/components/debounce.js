import { useEffect, useState } from "react";

function DebounceHook(inputValue, timer) {
  const [value, setValue] = useState(inputValue);

  useEffect(() => {
    const timerr = setTimeout(() => {
      setValue(inputValue);
    }, timer);
    return () => {
      clearTimeout(timerr);
    };
  }, [inputValue, timer]);

  return value;
}
export default DebounceHook;
