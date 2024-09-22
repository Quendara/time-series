import { Typography, Breadcrumbs, Link, Icon } from "@mui/material";
import React from "react";
import { JoplinData, folderNameFromId } from "./JolinNote";
import { NavLink } from "react-router-dom";

export interface FolderNavProps {
    data: JoplinData
    folders: JoplinData[]
    selectCallback: (id: string) => void;
}

export const FolderNav = (props: FolderNavProps) => {

    const getParentEl = (cur: JoplinData | undefined) => {

        if (cur === undefined) return [];
        return props.folders.filter(el => el.id === cur.parent_id);
    };

    const parent_lv1 = getParentEl(props.data).at(0);
    const parent_lv2 = getParentEl(parent_lv1).at(0);
    const parent_lv3 = getParentEl(parent_lv2).at(0);

    const createLink = (cur: JoplinData) => {
        
        const foldername = folderNameFromId(props.folders, cur.id)
        
        return (
            // <Link underline="hover" color="inherit"
            //     // href={"/joplin/folder/" + parent_lv2?.title}
            //     onClick={() => props.selectCallback(cur.id)}
            // >
            //     {folderNameFromId(props.folders, cur.id)}
            // </Link>
            <NavLink color="inherit"
                to={"/joplin/folder/" + cur.id }
                // onClick={() => props.selectCallback(cur.id)}
            >
                
                <Typography variant="h6" sx={{ color: 'grey', textDecoration: "none"  }}>{foldername}</Typography>
            </NavLink>
        )
    }

    const renderNav = (cur: JoplinData) => {
        return (
            <Breadcrumbs aria-label="breadcrumb">
                <NavLink color="inherit"
                    // onClick={() => props.selectCallback("")}
                    to={"/joplin/folder/" }
                >                    
                    
                    <Typography variant="h6" sx={{ color: 'text.primary' }}>Root</Typography>
                </NavLink>
                {parent_lv3 && createLink(parent_lv3)}
                {parent_lv2 && createLink(parent_lv2)}
                {parent_lv1 && createLink(parent_lv1)}

                <Typography variant="h6" sx={{ color: 'text.primary' }}>{cur.title}</Typography>

            </Breadcrumbs>
        );
    };


    return (
        <>
            {renderNav(props.data)}
        </>
    );
};
