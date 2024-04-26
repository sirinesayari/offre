/* eslint-disable */
import {  Grid, Stack, Typography} from '@mui/material';
import LinearProgress from '@mui/material/LinearProgress';
import MDBox from 'components/MDBox';
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import CustomProgress from './ProgressionBar';

export default function Status({isLoading , status}){
    return(
  <DashboardLayout>
    <MDBox >
      <Grid container justifyContent="center" alignItems="center">
          <item item xs={15} md={5}>
            <Typography style={{ fontWeight:"bold" , marginLeft:"-310px"}}>
                {isLoading
                 ? `Calculating... ${status || 'uploading'}...`
                 : 'Veuillez donner votre feedback !'
                }
            </Typography>
            <Stack sx={{ width: '45%'  }}>
              <CustomProgress isLoading={isLoading} style={{ marginLeft: 0 }} />
            </Stack>
          </item>
      </Grid>
    </MDBox> 
  </DashboardLayout>
    );
}