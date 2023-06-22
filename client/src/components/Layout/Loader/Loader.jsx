import { Spinner, VStack } from '@chakra-ui/react';
import React from 'react';

const Loader = ({ color = 'purple.500' }) => {
  return (
    <VStack h="100vh" justifyContent={'center'}>
      <div style={{ transform: 'scale(2)' }}>
        <Spinner
          thickness="2px"
          speed="0.65s"
          emptyColor="transparent"
          color={color}
          size="sm"
          mr={4}
        />
        Loading...
      </div>
    </VStack>
  );
};

export default Loader;
