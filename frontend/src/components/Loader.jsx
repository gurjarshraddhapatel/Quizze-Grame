import React, { useContext } from "react";
import { PropagateLoader  } from "react-spinners";
import { Context } from "../index";

const Loader = () => {
  const { loading } = useContext(Context);

  return (
    <div>
      <PropagateLoader 
        color={"#36d7b7"}
        loading={loading}
        size={20}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
    </div>
  );
};

export default Loader;