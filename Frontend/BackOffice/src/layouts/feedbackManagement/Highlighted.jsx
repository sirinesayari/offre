/* eslint-disable */
import { Box , Tooltip, Typography } from '@mui/material' ;
import "./index.css";
const sentimentColor = {
    POSITIVE: 'lightgreen',
    NEGATIVE : 'pink' ,
    NEUTRAL: 'lightgray',
}

export default function Highlighted ({text , sentiment , entities}){

    const entityText = entities.map((e) => e.text);
    const parts = text.split(new RegExp(`(${entityText.join('|')})`, 'g'));

    return (
        <Box as="mark" className={`highlighted-${sentiment}`} mr="1">
        {parts.map(part => {
            const matchingEntity = entities.find((e) => e.text === part);

            if (matchingEntity){
                return (
                    <Tooltip label = {matchingEntity.entity_type} key={part}>
                        <Typography display="inline" fontSize="xl" fontWeight="bold">
                            {part}
                        </Typography>
                    </Tooltip>
                );
            }

            return part ;
        })}
    </Box>
    );
}