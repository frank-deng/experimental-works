#!/usr/bin/env python3
#coding=utf-8

import sys,random;

if __name__=='__main__':
    droid = None;
    try:
        import android;
        droid = android.Android();
        droid.wakeLockAcquirePartial();
    except ImportError:
        pass;

    try:
        money = int(input("Money: "));
        if (money <= 0):
            raise ValueError;
        bet_orig = int(input("Bet: "));
        if (bet_orig <= 0):
            raise ValueError;
        sys.stdout.write('\033[?25l');
    except ValueError:
        print("Invalid value provided");
        exit(1);

    rounds = 0;
    try:
        while (money > 0):
            rounds += 1;
            if (bet_orig > money):
                bet = money;
            else:
                bet = bet_orig;
            if random.choice((True, False)):
                money += bet;
            else:
                money -= bet;
            sys.stdout.write("\033[1000DRound %d, Money: %d\033[K"%(rounds, money));
    except KeyboardInterrupt:
        pass;

    sys.stdout.write('\033[?25h');
    if (money > 0):
        print("\033[1000DYou have %d now.\033[K"%(money));
    else:
        print("\033[1000DYou bankrupt after gambling for %d rounds.\033[K"%(rounds));

    if (droid != None):
        droid.wakeLockRelease();

