import RomeDataManager , {fetchWrapper} from "../app/RomeDataManager";


export const drawData = (floorplan_id) => {
    return (dispatch) => {
        const formData = new FormData();
        formData.append('floorplan_id', floorplan_id); // Assuming 'token' is the expected field name

        const requestOptions = {
            headers: {
                'Content-Type': 'multipart/form-data', // Set content type as multipart/form-data
            },
        };

        fetchWrapper.post(`/floorplans/floorplan_activities/draw`, formData, requestOptions)
            .then(response => {
                dispatch({
                    type: "ADD_TOKEN_SUCCESS",
                    payload: response.data // assuming the response contains some data you might need
                });
                console.log(response);
                
            })
            .catch(error => {
                dispatch({
                    type: "ADD_TOKEN_FAILURE",
                    payload: error.response ? error.response.data : 'Unknown error'
                });
                console.log("Error", error);
            });
    };
} 