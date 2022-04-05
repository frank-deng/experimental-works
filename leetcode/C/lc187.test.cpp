#include "test.h"

class TestLeetCode187 : public Test
{
public:
    char **result;
    int length;
    virtual void SetUp() override;
    virtual void TearDown() override;
};
void TestLeetCode187::SetUp(){
    result = NULL;
    length = 0;
}
void TestLeetCode187::TearDown(){
    if (NULL == result) {
        return;
    }
    for (int i = 0; i < length; i++) {
        free(result[i]);
        result[i] = NULL;
    }
    free(result);
    result = NULL;
}
TEST_F(TestLeetCode187, test0)
{
    this->result = findRepeatedDnaSequences("AAAAAAAAAAA", &this->length);
    EXPECT_EQ(1, this->length);
    EXPECT_STREQ("AAAAAAAAAA", this->result[0]);
}
TEST_F(TestLeetCode187, test1)
{
    this->result = findRepeatedDnaSequences(
        "AAAAACCCCCAAAAACCCCCCAAAAAGT", &this->length);
    EXPECT_EQ(2, this->length);
    EXPECT_STREQ("AAAAACCCCC", this->result[0]);
    EXPECT_STREQ("CCCCCAAAAA", this->result[1]);
}

