import React from "react";

import { useEffect, useState } from "react";
import { List, Stack, Stepper, Tab, Tabs, useTheme } from "@mui/material";
import { JolinNote, JoplinData, NoteOrder, getNotePriority } from "./JolinNote";
import { NotedToSort } from "./PageJoplin";
import { settings } from "./JoplinCommon";

type NoteAlignment = 'vertical' | 'horizontal'


export interface NotesProps {
    query: string
    folders: JoplinData[]
    order: NoteOrder
    renderAs: NoteAlignment
    autoSelect: boolean // select first item
    selectedNoteId?: string
    selectCallback: (id: string) => void;
}

export const ListNotesJoplin = (props: NotesProps) => {
    const theme = useTheme();
    const [todos, setTodos] = useState<NotedToSort[]>([]);

    // const loadTodos = () => {
    useEffect(() => {
        const query = props.query;
        const fields = "fields=id,title,updated_time,body,parent_id&";
        let order = "order_by=updated_time&order_dir=DESC&";

        if (props.order === "title") {
            order = "order_by=title&order_dir=ASC&";
        }

        const urlTodos = "http://localhost:41184" + query + order + fields + settings.token;
        fetch(urlTodos).then(response => {
            console.log("response", response);
            return response.json();
        }).then(jsonResp => {
            console.log("Todos : ", jsonResp);

            const local: JoplinData[] = jsonResp["items"];
            let prep: NotedToSort[] = local.map((item: JoplinData) => {
                return {
                    prio: getNotePriority(item),
                    note: item
                };
            });

            // sort when necesary
            if (props.order === "prio") {
                prep = prep.sort((a, b) => (a.prio < b.prio ? -1 : 1));
            }

            setTodos(prep);
            if (prep.length > 0) {
                if (props.autoSelect) {
                    props.selectCallback(prep[0].note.id);
                }
            }
        });


    }, [props.folders, props.query]);




    const render = () => {

        switch (props.renderAs) {
            case "horizontal":
                return (
                    <Stack direction="row" sx={ {borderBottom: "1px solid",  borderColor: theme.palette.grey[300]  }  }>
                        {todos.map((item: NotedToSort) =>
                            
                            <JolinNote
                                data={item.note}
                                folders={props.folders}
                                xs={12}
                                
                                renderAs="tab"
                                selectedId={props.selectedNoteId}

                                selectCallback={props.selectCallback} />

                        )}
                    </Stack>
                )

            case "vertical":
            default:
                return (
                    <List>
                        {todos.map((item: NotedToSort) =>
                            <JolinNote
                                data={item.note}
                                folders={props.folders}
                                xs={12}                                
                                selectedId={props.selectedNoteId}
                                renderAs="list"
                                selectCallback={props.selectCallback} />
                        )}
                    </List> )


        }


    }

    return render()
};
