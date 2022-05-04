#ifndef util_h
#define util_h

#include "test.h"

#ifdef __cplusplus
extern "C" {
#endif

struct TreeNode* genTree(int *, size_t);
void freeTree(struct TreeNode*);

#ifdef __cplusplus
}
#endif

#endif

