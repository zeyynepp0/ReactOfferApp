import Menu from "./Menu";
import MenuItem from "./MenuItem";
import { FaDotCircle } from "react-icons/fa";
import MenuSecond from "./MenuSecond";
import React from "react";

const Test = () => {
  const [anch, setAnch] = React.useState<null | HTMLElement>(null);
  return (
    <div className="p-32">
      <button onClick={(e) => setAnch(e.currentTarget)}>BUTON</button>
      <MenuSecond onClose={() => setAnch(null)} anchorElement={anch}>
        şsaldasdşsaldk
      </MenuSecond>
    </div>
  );
};

export default Test;
