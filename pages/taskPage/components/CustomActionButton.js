import React from "react";
import { Fab, Icon } from "native-base";

const CustomActionButton = ({ refRBSheet }) => {
  return (
    <Fab
      active={true}
      direction="up"
      containerStyle={{}}
      style={{ backgroundColor: "#3F51B5" }}
      position="bottomRight"
      onPress={() => refRBSheet.current.open()}
    >
      <Icon type="FontAwesome" name="plus" />
    </Fab>
  );
};

export default CustomActionButton;
