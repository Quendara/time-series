import React from "react";

// import TimelineIcon from '@material-ui/icons/Timeline';
// import ShareIcon from '@material-ui/icons/Share';
// import AssignmentTurnedInIcon from '@material-ui/icons/AssignmentTurnedIn';
// import ChatIcon from '@material-ui/icons/Chat';
// import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
// import MoreIcon from '@material-ui/icons/MoreVert';
// import ExitToAppIcon from '@material-ui/icons/ExitToApp';
// import UpdateIcon from '@material-ui/icons/Update';
// import WorkOutlineIcon from '@material-ui/icons/WorkOutline';
// import LocalFloristIcon from '@material-ui/icons/LocalFlorist';
// import EventIcon from '@material-ui/icons/Event';
// import DeveloperModeIcon from '@material-ui/icons/DeveloperMode';
// import ChildFriendlyIcon from '@material-ui/icons/ChildFriendly';
// import SettingsIcon from '@material-ui/icons/Settings';
import Icon from '@material-ui/core/Icon';

// const textToIcon = {
//     timeline: ( <TimelineIcon /> ),
//     share: ( <ShareIcon /> ),
//     chat: ( <ChatIcon /> ),
//     shoppingCart: ( <ShoppingCartIcon /> ),
//     assignmentTurnedIn: ( <AssignmentTurnedInIcon /> ),
//     exitToApp: ( <ExitToAppIcon /> ),
//     developer: ( <DeveloperModeIcon /> ),
//     update: ( <UpdateIcon /> ),
//     work: ( <WorkOutlineIcon /> ),
//     flower: ( <LocalFloristIcon /> ),
//     calendar: ( <EventIcon /> ),
//     child: ( <ChildFriendlyIcon /> ),    
//     settings: ( <SettingsIcon /> ),
    

// }

// const getIcon = (name) => {
//   let ret = textToIcon[name]
//   if (ret === undefined) {
//     ret = ( <MoreIcon /> )
//   }

//   // console.log( "getIcon" , name, "->" ,  ret )
//   return ret
// }

const textToIcon = {

}

const getIcon = (name) => {
  let ret = textToIcon[name]
  if (ret === undefined) {
    ret = name
  }

  // console.log( "getIcon" , name, "->" ,  ret )
  return ret
}

export const MyIcon = ({ icon, className="" }) => {

  return <Icon>{getIcon( icon ) }</Icon>
  // return getIcon(icon, className)
}

