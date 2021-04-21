import React from "react";

import TimelineIcon from '@material-ui/icons/Timeline';
import ShareIcon from '@material-ui/icons/Share';
import AssignmentTurnedInIcon from '@material-ui/icons/AssignmentTurnedIn';
import ChatIcon from '@material-ui/icons/Chat';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import MoreIcon from '@material-ui/icons/MoreVert';

const textToIcon = {
    timeline: ( <TimelineIcon /> ),
    share: ( <ShareIcon /> ),
    chat: ( <ChatIcon /> ),
    shoppingCart: ( <ShoppingCartIcon /> ),
    assignmentTurnedIn: ( <AssignmentTurnedInIcon /> ),

}

const getIcon = (name) => {
  let ret = textToIcon[name]
  if (ret === undefined) {
    ret = ( <MoreIcon /> )
  }

  // console.log( "getIcon" , name, "->" ,  ret )
  return ret
}

export const MyIcon = ({ icon, className }) => {
  return getIcon(icon, className)
}
