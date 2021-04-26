import React from "react";

import TimelineIcon from '@material-ui/icons/Timeline';
import ShareIcon from '@material-ui/icons/Share';
import AssignmentTurnedInIcon from '@material-ui/icons/AssignmentTurnedIn';
import ChatIcon from '@material-ui/icons/Chat';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import MoreIcon from '@material-ui/icons/MoreVert';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import UpdateIcon from '@material-ui/icons/Update';
import WorkOutlineIcon from '@material-ui/icons/WorkOutline';

const textToIcon = {
    timeline: ( <TimelineIcon /> ),
    share: ( <ShareIcon /> ),
    chat: ( <ChatIcon /> ),
    shoppingCart: ( <ShoppingCartIcon /> ),
    assignmentTurnedIn: ( <AssignmentTurnedInIcon /> ),
    exitToApp: ( <ExitToAppIcon /> ),
    update: ( <UpdateIcon /> ),
    work: ( <WorkOutlineIcon /> ),

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
