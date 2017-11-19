#include <stdio.h>
#include <stdlib.h>
#include <stdint.h>
#include <string.h>
#include <time.h>
#include <cuda_runtime.h>
#include <curand.h>

#define BLOCK_COUNT 2048
#define MILLER_RABIN_THREAD_COUNT 64

__constant__ uint32_t d_num_base[2];
__device__ uint32_t shifted_bits[BLOCK_COUNT];
__device__ uint32_t v_exp_mod[BLOCK_COUNT];
__global__ void init_num(uint32_t *num_all){
	int idx = blockIdx.x;
	uint32_t num = d_num_base[0] + idx * 2, u = num - 1;
	num_all[idx] = num;
	uint32_t k = 0;
	while(!(u & 1)) {
		k++;
		u >>= 1;
	}
	shifted_bits[blockIdx.x] = k;
}
__device__ __forceinline__ uint32_t mul_mod(uint32_t a0, uint32_t b0, uint32_t n0) {
	double a = a0, b = b0, n = n0;
	double q = __fma_rn(a * b, (double)1.0/n, 6755399441055744.0);
	q -= 6755399441055744.0;
	double h = n * q, l = __fma_rn(n, q, -h);
	double rem = __fma_rn(a, b, -h);
	if (rem < 0.0){
		rem += n;
	}
	return (uint32_t)rem;
}
__global__ void test_mul_mod(uint32_t *result){
	//result[0] = mul_mod(0x7FFFFFFF, 0x7FFFFFF0, 0x80000000);
	result[0] = mul_mod(3, 4, 5);
}
__device__ __forceinline__ uint32_t exp_mod(uint32_t a0, uint32_t b, uint32_t n) {
	uint32_t a = a0, result = 1;
	while (b) {
		if (b & 1) {
			result = mul_mod(result, a, n);
		}
		a = mul_mod(a, a, n);
		b /= 2;
	}
	return result;
}
__device__ __forceinline__ int _miller_rabin_test(uint32_t x, uint32_t shifted_bits, uint32_t n) {
	uint32_t pre = x;
	for (int i = 0; i < shifted_bits; i++) {
		x = mul_mod(x, x, n);
		if ((1 == x) && (pre != 1) && (pre != (n - 1))) {
			return 0;
		} else if (1 == x) {
			break;
		}
		pre = x;
	}
	if (x != 1) {
		return 0;
	}
	return 1;
}
__global__ void miller_rabin_test(uint32_t *num_all, float *d_rand_num) {
	int idx = threadIdx.x + blockDim.x * blockIdx.x;
	uint32_t n = num_all[blockIdx.x];
	uint32_t x = (uint32_t)(d_rand_num[idx] * (n - 2)) + 2;
	x = exp_mod(x, (n - 1) >> shifted_bits[blockIdx.x], n);
	if (!_miller_rabin_test(x, shifted_bits[blockIdx.x], num_all[blockIdx.x])) {
		num_all[blockIdx.x] = 0;
	}
}

int main(int argc, char *argv[]) {
//	uint32_t *d_mul_mod, mul_mod[1];
//	cudaMalloc(&d_mul_mod, sizeof(uint32_t));
//	test_mul_mod<<<1, 1, 0>>>(d_mul_mod);
//	cudaMemcpy(mul_mod, d_mul_mod, sizeof(uint32_t), cudaMemcpyDeviceToHost);
//	printf("%lu\n", mul_mod[0]);
//	return -1;

	uint32_t start, stop;
	if (argc != 3) {
		fputs("Invalid arguments.\n", stderr);
		return 1;
	} else {
		start = strtoul(argv[1], NULL, 0);
		stop = strtoul(argv[2], NULL, 0);
		if (start < 3) {
			start = 3;
		} else if (!(start & 1)) {
			start += 1;
		}
		if (start >= stop) {
			fputs("Invalid range.\n", stderr);
			return 1;
		}
	}

	curandGenerator_t gen;
	curandCreateGenerator(&gen, CURAND_RNG_PSEUDO_DEFAULT);
	curandSetPseudoRandomGeneratorSeed(gen, time(NULL));
	float *d_rand_num;
	cudaMalloc((void **)&d_rand_num, BLOCK_COUNT * MILLER_RABIN_THREAD_COUNT*sizeof(float));

	uint32_t *d_num, num[BLOCK_COUNT];
	cudaMalloc(&d_num, sizeof(uint32_t) * BLOCK_COUNT);

	uint32_t base = start, data[2];
	bool running = false;
	while (base < stop) {
		data[0] = base;
		data[1] = stop;
		if (running) {
			cudaMemcpy(num, d_num, sizeof(uint32_t) * BLOCK_COUNT, cudaMemcpyDeviceToHost);
		}
		cudaMemcpyToSymbol(d_num_base, data, sizeof(uint32_t) * 2);
		init_num<<<BLOCK_COUNT, 1, 0>>>(d_num);
		curandGenerateUniform(gen, d_rand_num, BLOCK_COUNT * MILLER_RABIN_THREAD_COUNT);
		miller_rabin_test<<<BLOCK_COUNT, MILLER_RABIN_THREAD_COUNT, 0>>>(d_num, d_rand_num);
		if (running) {
			for (int i = 0; i < BLOCK_COUNT; i++) {
				if (num[i] > 0 && num[i] < stop) {
					printf("%lu\n", num[i]);
				}
			}
		}
		running = true;
		base += BLOCK_COUNT * 2;
	}
	cudaFree(d_num);
	return 0;
}

