import { Box, Heading, HStack, Link, Stack, VStack } from '@chakra-ui/react';
import React from 'react';
import {
  AiFillLinkedin,
  AiFillTwitterCircle,
  AiFillGithub
} from 'react-icons/ai';
const Footer = () => {
  return (
    <Box padding={'10'} bg="blackAlpha.900" minH={'10vh'}>
      <Stack direction={['column', 'row']}>
        <VStack alignItems={['center', 'flex-start']} width="full">
          <Heading size="lg" children="All Rights Reserved" color={'white'} />
          <Heading
            fontFamily={'body'}
            size="sm"
            children="@Yash Upadhyay"
            color={'purple.400'}
          />
        </VStack>

        <HStack
          spacing={['2', '10']}
          justifyContent="center"
          color={'white'}
          fontSize="30"
        >
          <Link href="https://www.linkedin.com/in/yash-upadhyay-719aa622a/" target={'blank'} _hover={{color: 'purple.400'}}>
            <AiFillLinkedin />
          </Link>
          <Link href="https://twitter.com/yashupadhyay27" target={'blank'} _hover={{color: 'purple.400'}}>
            <AiFillTwitterCircle />
          </Link>
          <Link href="https://github.com/yash2723" target={'blank'} _hover={{color: 'purple.400'}}>
            <AiFillGithub />
          </Link>
        </HStack>
      </Stack>
    </Box>
  );
};

export default Footer;
