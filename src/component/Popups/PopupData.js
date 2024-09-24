import { Vector3 } from "three";

export const popupData = {
    1: {
        position: new Vector3(25, 25, 0),
        title: "Measure the length",
        description: "Use the pointers to select the inner length of any big room.",
        buttonText1: "Next",
        buttonType: "Move",
        order: "1/2",
    },
    2: {
        className: "selectScalePopup",
        title: "Enter the length",
        description: "Now, Enter the length of the room to set the scale.",
        buttonText1: "Okay",
        buttonType: "Okay",
        order: "2/2",
    },
    3: {
        className: "selectWallPopup",
        title: "Lets start drawing",
        description:
            "Select the 'Wall' option from the right panel and start drawing on the floorplan",
    },
    4: {
        position: new Vector3(0, 225, 0),
        title: "Let’s draw your first wall",
        description:
            "Click at the start and end of a wall in a room to draw a wall, don't include doors and windows",
    },
    5: {
        position: "customised",
        title: "Draw windows, doors and railings",
        description:
            "You can change the wall you just drew to a window, door, or balcony railing from here",
    },
    6: {
        className: "roomGeneratedPopup",
        title: "Bolt AI has automatically identified some of your rooms 🎉",
        buttonText1: "Next",
        buttonType: "Move",
        order: "1/3",
    },
    7: {
        className: "roomGeneratedPopup",
        title:
            "Sometimes two or more rooms are clubbed together, do you see a clubbed room?",
        buttonText1: "Yes",
        buttonText2: "No",
        buttonType: "Navigate",
        order: "2/3",
    },
    8: {
        className: "splitRoomPopup",
        title: "Please split them with this option",
        buttonType: "Move",
        buttonText1: "Next",
        buttonType: "Move",
    },
    9: {
        className: "roomGeneratedPopup",
        title: "Did our AI miss identifying a room?",
        buttonText1: "Yes",
        buttonText2: "No",
        buttonType: "Navigate",
        order: "3/3",
    },
    10: {
        className: "addRoomPopup",
        title: "You can add a new room with this option",
        buttonText1: "Okay",
        buttonType: "Okay",
    },
    11: {
        position: "customised",
        title: "Click and select a room to rename it",
    },
    12: {
        position: "customised",
        title: "Make sure all the walls in the room are selected",
    },
    13: {
        className: "renameRoomPopup",
        title: "Select the room type and name the the room",
    },
};
