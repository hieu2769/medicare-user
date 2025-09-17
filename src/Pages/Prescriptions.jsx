import { FaFileDownload } from "react-icons/fa";
import { GoFileSubmodule } from "react-icons/go";
import {
  Box,
  Card,
  CardBody,
  Flex,
  IconButton,
  Text,
  InputGroup,
  InputLeftElement,
  Input,
} from "@chakra-ui/react";
import { GET } from "../Controllers/ApiControllers";
import Loading from "../Components/Loading";
import ErrorPage from "./ErrorPage";
import { AnimatePresence, motion } from "framer-motion";
import user from "../Controllers/user";
import { useQuery } from "@tanstack/react-query";
import moment from "moment";
import { SearchIcon } from "@chakra-ui/icons";
import { useState } from "react";
import useDebounce from "../Hooks/UseDebounce";
import api from "../Controllers/api";
import printPDF from "../Controllers/printPDF";
import imageBaseURL from "../Controllers/image";

function Prescriptions() {
  const [searchQuery, setsearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 1000);

  const getData = async () => {
    const res = await GET(
      `get_prescription?user_id=${user.id}&search_query=${debouncedSearchQuery}`
    );
    return res.data;
  };
  const { data, isLoading, error } = useQuery({
    queryKey: ["prescriptions", debouncedSearchQuery],
    queryFn: getData,
  });

  if (isLoading) return <Loading />;
  if (error) return <ErrorPage />;

  return (
    <Box minH={"50vh"}>
      <Box bg={"primary.main"} p={4} py={{ base: "4", md: "10" }}>
        <Box className="container">
          <Text
            fontSize={{ base: 18, md: 32 }}
            fontWeight={700}
            textAlign={"center"}
            mt={0}
            color={"#fff"}
          >
            Đơn thuốc
          </Text>
        </Box>
      </Box>
      <Box className="container" maxW={600}>
        <Box
          w={"full"}
          rounded={"lg"}
          mt={5}
          borderRadius={8}
          overflow={"hidden"}
          p={2}
        >
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Box w="100%" mx="auto" mb={5}>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <SearchIcon color="gray.300" />
                  </InputLeftElement>
                  <Input
                    placeholder="Tìm kiếm đơn thuốc..."
                    value={searchQuery}
                    onChange={(e) => {
                      let value = e.target.value;
                      setsearchQuery(value);
                    }}
                    variant="outline"
                    focusBorderColor="blue.400"
                    bg={"#fff"}
                  />
                </InputGroup>
              </Box>
              {data &&
                (!data.length ? (
                  <Text
                    fontSize={14}
                    fontWeight={600}
                    mb={0}
                    textAlign={"center"}
                  >
                    Các tệp hiện không có sẵn. Bạn sẽ có thể truy cập chúng sau khi bác sĩ tải lên các tài liệu cần thiết
                  </Text>
                ) : (
                  <Box mt={5}>
                    {data.map((file) => (
                      <motion.div
                        key={file.id}
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7 }}
                      >
                        <Card cursor={"pointer"} mb={4} onClick={() => {}}>
                          <CardBody p={4}>
                            <Flex align={"center"} justify={"space-between"}>
                              <Flex align={"center"} gap={4}>
                                {" "}
                                <GoFileSubmodule
                                  fontSize={24}
                                  color="#2D3748"
                                />
                                <Box>
                                  <Text fontSize={14} fontWeight={600} mb={0}>
                                    {file.patient_f_name} {file.patient_l_name}{" "}
                                    #{file.id}
                                  </Text>
                                  <Text fontSize={13} fontWeight={500} mb={0}>
                                    Bác sĩ {file.doctor_f_name}{" "}
                                    {file.doctor_l_name}{" "}
                                  </Text>
                                  <Text fontSize={12} fontWeight={600}>
                                    {moment(file.created_at).format(
                                      "D-MMM-YY HH:MM A"
                                    )}
                                  </Text>
                                </Box>
                              </Flex>
                              <IconButton
                                icon={<FaFileDownload />}
                                colorScheme={"blue"}
                                size={"sm"}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (file.pdf_file) {
                                    printPDF(
                                      `${imageBaseURL}/${file.pdf_file}`
                                    );
                                  } else {
                                    printPDF(
                                      `${api}/prescription/generatePDF/${file.id}`
                                    );
                                  }
                                }}
                              />
                            </Flex>
                          </CardBody>
                        </Card>
                      </motion.div>
                    ))}
                  </Box>
                ))}
            </motion.div>
          </AnimatePresence>
        </Box>
      </Box>
    </Box>
  );
}

export default Prescriptions;
