//
//  Brightness.m
//  Reader_
//
//  Created by Czq on 2017/12/17.
//  Copyright © 2017年 Facebook. All rights reserved.
//

#import "Brightness.h"

@implementation Brightness

//导出模块
RCT_EXPORT_MODULE();    //此处不添加参数即默认为这个OC类的名字

+ (void)setBrightness:(double)num
{
  [[UIScreen mainScreen] setBrightness: num];
}


RCT_EXPORT_METHOD(set:(double)num)
{
  [Brightness setBrightness:num];
}

RCT_EXPORT_METHOD(get:(RCTResponseSenderBlock)callback)
{
  double x = [[UIScreen mainScreen] brightness];
  NSString *str = [NSString stringWithFormat:@"%f",x];
  callback(@[str]);
}

@end
