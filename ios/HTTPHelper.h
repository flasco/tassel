//
//  HTTPHelper.h
//  CodeLogin
//
//  Created by Czq on 2018/6/13.
//  Copyright © 2018年 Czq. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface HTTPHelper : NSObject
+ (void)postRequestByServiceUrl:(NSString *)service
                         andApi:(NSString *)api
                      andParams:(NSDictionary *)params
                    andCallBack:(void (^)(id obj))callback;
@end
