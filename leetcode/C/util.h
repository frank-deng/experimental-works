#ifndef __util_h__
#define __util_h__

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

