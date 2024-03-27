import * as React from 'react';
import Box from '@mui/material/Box';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { TreeView } from '@mui/x-tree-view/TreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import Container from '@mui/material/Container';
import '../App.css';


export default function SimpleTreeContainer() {
  return (
    <Container maxWidth="sm" sx={{padding:'20px'}}>
    <Box sx={{ minHeight: 180, flexGrow: 1, maxWidth: 300 }}>
      <TreeView
        aria-label="file system navigator"
        defaultCollapseIcon={<ExpandMoreIcon />}
        defaultExpandIcon={<ChevronRightIcon />}
      >
        <TreeItem nodeId="1" label="Aethalops_alecto">
          <TreeItem nodeId="2" label="mAetAle1" />
            <TreeItem nodeId="2" label="transcriptomic_data" />
              <TreeItem nodeId="2" label="kidney" />
                <TreeItem nodeId="2" label="illumina" />
        </TreeItem>
        <TreeItem nodeId="5" label="Documents">
          <TreeItem nodeId="10" label="OSS" />
          <TreeItem nodeId="6" label="MUI">
          </TreeItem>
        </TreeItem>
      </TreeView>
    </Box>
    </Container>
  );
}
