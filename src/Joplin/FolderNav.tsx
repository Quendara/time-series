import { Typography, Breadcrumbs, Link, Icon } from "@mui/material";
import React from "react";
import { JoplinData, folderNameFromId } from "./JolinNote";

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
        return (
            <Link underline="hover" color="inherit"
                // href={"/joplin/folder/" + parent_lv2?.title}
                onClick={() => props.selectCallback(cur.id)}
            >
                {folderNameFromId(props.folders, cur.id)}
            </Link>
        )
    }

    const renderNav = (cur: JoplinData) => {
        return (
            <Breadcrumbs aria-label="breadcrumb">
                <Link underline="hover" color="inherit"
                    onClick={() => props.selectCallback("")}
                >
                    {/* <Icon fontSize="small">home</Icon>  */}
                    Root
                </Link>
                {parent_lv3 && createLink(parent_lv3)}
                {parent_lv2 && createLink(parent_lv2)}
                {parent_lv1 && createLink(parent_lv1)}

                <Typography sx={{ color: 'text.primary' }}>{cur.title}</Typography>

            </Breadcrumbs>
        );
    };


    return (
        <>
            {renderNav(props.data)}
        </>
    );
};
