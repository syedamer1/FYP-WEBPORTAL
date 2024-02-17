import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { Breadcrumbs as MuiBreadcrumbs, Grid, Typography, Link } from '@mui/material';
import CustomCard from './CustomCard';


const Breadcrumbs = ({ pageinfo }) => {
  const location = useLocation();
  const [currentItem, setCurrentItem] = useState(null);

  const findCurrentItem = (page) => {
    page.forEach((item) => {
      if (item.url && location.pathname.startsWith(item.url)) {
        setCurrentItem(item);
      }
      if (item.children) {
        findCurrentItem(item.children);
      }
    });
  };

  useEffect(() => {
    findCurrentItem(pageinfo);
  }, [location.pathname, pageinfo]);

  let breadcrumbContent;

  if (currentItem) {
    breadcrumbContent = (
      <CustomCard border={false} sx={{ mb: 3, bgcolor: 'transparent' }} content={false}>
        <Grid container direction="column" justifyContent="flex-start" alignItems="flex-start" spacing={1}>
          <Grid item>
            <MuiBreadcrumbs aria-label="breadcrumb">
              <Link component={RouterLink} to="/" color="textSecondary" variant="h6" sx={{ textDecoration: 'none' }}>
                Home
              </Link>
              {currentItem.url && (
                <Typography
                  component={RouterLink}
                  to={currentItem.url}
                  variant="h6"
                  sx={{ textDecoration: 'none', fontWeight: 'bold' }}
                  color="black"
                >
                  {currentItem.title}
                </Typography>
              )}
            </MuiBreadcrumbs>
          </Grid>
        </Grid>
      </CustomCard>
    );
  }

  return breadcrumbContent;
};

Breadcrumbs.propTypes = {
  pageinfo: PropTypes.array,
  title: PropTypes.bool
};

export default Breadcrumbs;
